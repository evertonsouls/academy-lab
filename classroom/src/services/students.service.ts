import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';

interface CreateStudentParams {
  authUserId: string;
}

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  getStudentByAuthUserId(authUserId: string) {
    return this.prisma.student.findUnique({ where: { authUserId } });
  }

  getStudentById(id: string) {
    return this.prisma.student.findUnique({ where: { id } });
  }

  createStudent({ authUserId }: CreateStudentParams) {
    return this.prisma.student.create({
      data: {
        authUserId,
      },
    });
  }

  listAllStudents() {
    return this.prisma.student.findMany();
  }
}
