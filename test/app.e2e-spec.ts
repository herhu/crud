import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateSecretNoteDto, UpdateSecretNoteDto } from './../src/secret-note/dto';
import { DataSource } from 'typeorm';

describe('SecretNoteController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    await app.init();
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  it('/secret-notes (POST)', async () => {
    const createSecretNoteDto: CreateSecretNoteDto = { note: 'This is a test note' };
    const response = await request(app.getHttpServer())
      .post('/secret-notes')
      .send(createSecretNoteDto)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('note');
  });

  it('/secret-notes (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/secret-notes')
      .expect(200);

    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it('/secret-notes/:id (GET)', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/secret-notes')
      .send({ note: 'This is another test note' })
      .expect(201);

    const id = createResponse.body.id;

    const response = await request(app.getHttpServer())
      .get(`/secret-notes/${id}`)
      .expect(200);

    expect(response.text).toBe('This is another test note');
  });

  it('/secret-notes/:id (PUT)', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/secret-notes')
      .send({ note: 'Update test note' })
      .expect(201);

    const id = createResponse.body.id;
    const updateSecretNoteDto: UpdateSecretNoteDto = { note: 'Updated note content' };

    const updateResponse = await request(app.getHttpServer())
      .put(`/secret-notes/${id}`)
      .send(updateSecretNoteDto)
      .expect(200);

    expect(updateResponse.body).toHaveProperty('note');
    expect(updateResponse.body.note).toContain('Updated note content');
  });

  it('/secret-notes/:id (DELETE)', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/secret-notes')
      .send({ note: 'Delete test note' })
      .expect(201);

    const id = createResponse.body.id;

    await request(app.getHttpServer())
      .delete(`/secret-notes/${id}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/secret-notes/${id}`)
      .expect(404);
  });
});
