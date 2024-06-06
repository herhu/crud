import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('SecretNoteController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  beforeEach(async () => {
    await dataSource.synchronize(true);
  });

  it('/secret-notes (POST)', () => {
    return request(app.getHttpServer())
      .post('/secret-notes')
      .send({ note: 'This is a test note' })
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
      });
  });

  it('/secret-notes (GET)', () => {
    return request(app.getHttpServer())
      .get('/secret-notes')
      .expect(200)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Array);
      });
  });

  it('/secret-notes/:id (GET)', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/secret-notes')
      .send({ note: 'This is a test note' })
      .expect(201);

    const noteId = createResponse.body.id;

    return request(app.getHttpServer())
      .get(`/secret-notes/${noteId}`)
      .expect(200)
      .then((response) => {
        expect(response.text).toBe('This is a test note');
      });
  });

  it('/secret-notes/:id/encrypted (GET)', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/secret-notes')
      .send({ note: 'This is a test note' })
      .expect(201);

    const noteId = createResponse.body.id;

    return request(app.getHttpServer())
      .get(`/secret-notes/${noteId}/encrypted`)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('note');
      });
  });

  it('/secret-notes/:id (PUT)', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/secret-notes')
      .send({ note: 'This is a test note' })
      .expect(201);

    const noteId = createResponse.body.id;

    return request(app.getHttpServer())
      .put(`/secret-notes/${noteId}`)
      .send({ note: 'This is an updated test note' })
      .expect(200)
      .then((response) => {
        expect(response.body.note).toBeDefined();
      });
  });

  it('/secret-notes/:id (DELETE)', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/secret-notes')
      .send({ note: 'This is a test note' })
      .expect(201);

    const noteId = createResponse.body.id;

    return request(app.getHttpServer())
      .delete(`/secret-notes/${noteId}`)
      .expect(200)
      .then(() => {
        return request(app.getHttpServer())
          .get(`/secret-notes/${noteId}`)
          .expect(404);
      });
  });
});
