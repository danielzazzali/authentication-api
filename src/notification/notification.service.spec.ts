import { Test, TestingModule } from '@nestjs/testing';
import * as nodemailer from 'nodemailer';
import { NotificationService } from './notification.service';
import { Transporter } from 'nodemailer';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue(true),
  }),
}));

describe('NotificationService', () => {
  let service: NotificationService;
  let mockTransporter: jest.MockedFunction<Transporter['sendMail']>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationService],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    mockTransporter = (
      nodemailer.createTransport as jest.MockedFunction<
        typeof nodemailer.createTransport
      >
    )().sendMail as jest.MockedFunction<nodemailer.Transporter['sendMail']>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send email', async () => {
    const to = 'test@example.com';
    const subject = 'Test Subject';
    const text = 'Test Text';

    await service.sendEmail(to, subject, text);

    expect(mockTransporter).toHaveBeenCalledWith({
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: text,
    });
  });
});
