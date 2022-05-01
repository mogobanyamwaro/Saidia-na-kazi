import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserInput } from '@saidia-na-kazi/backend/dtos';
import {
  Profile,
  ProfileDocument,
  User,
} from '@saidia-na-kazi/backend/entities';
import { HashHelper, Pagination } from '@saidia-na-kazi/backend/shared';
import { isPhoneNumber } from 'class-validator';
import { PaginationRequest } from '@saidia-na-kazi/backend/shared';
import { TimeoutError } from 'rxjs';
import { Repository } from 'typeorm';
import { UpdateDocumentInput } from './dtos/profile.input';
import { UserMapper } from './mappers/user.mapper';

@Injectable()
export class UsersService {
  allowedRelations: string[] = ['profile'];

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    @InjectRepository(ProfileDocument)
    private readonly profileDocsRepo: Repository<ProfileDocument>
  ) {}

  /**
   *
   * @param username
   * @returns
   */
  async findOneByEmailOrPhone(username: string) {
    const queryBuilder = this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile');
    if (isPhoneNumber(username)) {
      queryBuilder.orWhere('profile.phone = :phone', { phone: username });
    } else {
      queryBuilder.orWhere('user.email = :email', { email: username });
      queryBuilder.orWhere('profile.username = :username', {
        username: username,
      });
    }

    return queryBuilder.getOne();
  }

  async getUsers(pagination: PaginationRequest) {
    try {
      const [users, total] = await this.getUsersAndCount(pagination);
      const userResponse = users.map(UserMapper.toDtoWithRelations);
      return Pagination.of(pagination, total, userResponse);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException();
      }

      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getUsersAndCount(pagination: PaginationRequest) {
    const {
      skip,
      limit: take,
      order,
      params: { search },
    } = pagination;

    const query = this.userRepo
      .createQueryBuilder('users')
      .leftJoinAndSelect('user.profile', 'profile')
      .skip(skip)
      .take(take)
      .orderBy(order);

    if (search) {
      query.where(
        `
        users.username LIKE :search OR
        users.email LIKE :search OR
        users.role LIKE :search OR
      `,
        { search: `%${search}%` }
      );
    }

    return await query.getManyAndCount();
  }

  async createUser(input: CreateUserInput) {
    const exists = await this.userRepo.findOne({
      where: {
        email: input.email,
      },
    });
    if (exists) {
      return {
        code: HttpStatus.FOUND,
        message: 'Email in Use ,please Login',
      };
    }
    const {
      firstName: _firstName,
      lastName: _lastName,
      phone,
      ...rest
    } = input;

    const password = await HashHelper.encrypt(input.password);
    const newUser = await this.userRepo.save(
      this.userRepo.create({
        email: rest.email,
        role: rest.role,
        password,
      })
    );

    if (phone) {
      const profile = new Profile();
      profile.phone = phone;
      profile.user = newUser;
      profile.firstName = _firstName ?? null;
      profile.lastName = _lastName ?? null;
      await this.profileRepo.save(profile);
      newUser.profile = profile;
      await this.userRepo.save(newUser);
    }

    return await this.userRepo.findOne({
      where: {
        id: newUser.id,
      },
      relations: this.allowedRelations,
    });
  }

  async resetUserPassword(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: {
        email,
      },
      relations: this.allowedRelations,
    });
    if (user) {
      user.password = await HashHelper.encrypt(password);
      const saved = await this.userRepo.save(user);
      return saved;
    }
    return {
      code: HttpStatus.NOT_FOUND,
      message: `User with email ${email} not found`,
    };
  }

  async findById(id: string, relations?: string[]) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: relations ?? this.allowedRelations,
    });
    return user;
  }

  async findByEmailVerificationToken(token: string) {
    return this.userRepo.findOne({
      where: {
        emailVerificationToken: token,
      },
    });
  }

  async verifyPassword(hashedPassword: string, password: string) {
    return HashHelper.compare(password, hashedPassword);
  }

  async deleteDocument(user: User, documentId: string) {
    const document = await this.profileDocsRepo.findOne({
      where: {
        id: documentId,
      },
      relations: ['profile', 'profile.user', 'profile.documents'],
    });
    if (!document) {
      return {
        code: HttpStatus.NOT_FOUND,
        message: 'Document not found',
        timeStamp: new Date().toISOString(),
      };
    }
    if (document.profile?.user?.id === user.id) {
      const exists = document.profile.documents.find(
        (document) => document.id === documentId
      );
      if (!exists) {
        throw new NotFoundException(`Document not found`);
      }

      this.arrayRemove(document.profile.documents, document);
      return !!this.profileDocsRepo.remove(document);
    }
  }
  arrayRemove(arr: any[], value: any) {
    return arr.filter(function (ele) {
      return ele.id != value.id;
    });
  }
  //TODO UPDATE PROFILE

  async updateDocument(user: User, input: UpdateDocumentInput) {
    const { profile } = user;
    const { id, ...rest } = input;

    const document = await this.profileDocsRepo.findOne({
      where: { id },
      relations: ['profile'],
    });
    if (document.profile.id !== profile.id) {
      return {
        code: HttpStatus.FORBIDDEN,
        message: 'No Such document was uploaded on your profile',
      };
    }

    Object.assign(document, rest);

    await this.profileDocsRepo.save(document);
  }
}
