import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { SeedService } from '../src/seed/seed.service';
import { configureApp } from '../src/configureApp';

describe('/services', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await configureApp(app);
    await app.init();

    // Seed database
    await app.get(SeedService).seedDatabase();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should return all services for org 1', () => {
    return request(app.getHttpServer())
      .get('/v1/organization/1/services?pageSize=100')
      .expect(200)
      .expect((res) => {
        // assumes all services return in a page
        expect(res.body.meta.orgId).toBe(1);

        expect(res.body.data).toHaveLength(res.body.pagination.total);
        expect(res.body.pagination.pageSize).toBe(100);
        expect(res.body.pagination.firstPage).toBe(0);
        expect(res.body.pagination.currentPage).toBe(0);
        expect(res.body.pagination.nextPage).toBe(null);
        expect(res.body.pagination.lastPage).toBe(0);

        expect(res.body.data[0].id).toBeDefined();
        expect(res.body.data[0].name).toBeDefined();
        expect(res.body.data[0].description).toBeDefined();
        expect(res.body.data[0].versions).toBeDefined();

        // assumes first service has a version
        expect(res.body.data[0].versions[0].name).toBeDefined();
        expect(res.body.data[0].versions[0].swaggerLink).toBeDefined();
        expect(res.body.data[0].versions[0].status).toBeDefined();
        expect(res.body.data[0].versions[0].id).not.toBeDefined();
      });
  });

  describe('pagination', () => {
    it('should respect pageSize', () => {
      return request(app.getHttpServer())
        .get('/v1/organization/1/services?pageSize=2')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveLength(2);
          expect(res.body.pagination.firstPage).toBe(0);
          expect(res.body.pagination.currentPage).toBe(0);
          // assumes has at least 3 services
          expect(res.body.pagination.nextPage).toBe(1);
          // assumes has 6 services
          expect(res.body.pagination.lastPage).toBe(2);
        });
    });

    it('should reject a negative pageSize parameter', () => {
      return request(app.getHttpServer())
        .get('/v1/organization/1/services?pageSize=-1')
        .expect(400);
    });

    it('should replace a 0 pageSize parameter with default', () => {
      return request(app.getHttpServer())
        .get('/v1/organization/1/services?pageSize=0')
        .expect(200)
        .expect((res) => {
          expect(res.body.pagination.pageSize).toBe(10);
        });
    });

    it('should reject a huge pageSize parameter', () => {
      return request(app.getHttpServer())
        .get('/v1/organization/1/services?pageSize=101')
        .expect(400);
    });

    it('should respect page parameter', () => {
      return request(app.getHttpServer())
        .get('/v1/organization/1/services?pageSize=2&page=1')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveLength(2);
          expect(res.body.pagination.firstPage).toBe(0);
          expect(res.body.pagination.currentPage).toBe(1);
          // assumes has at least 5 services
          expect(res.body.pagination.nextPage).toBe(2);
          // assumes has 6 services
          expect(res.body.pagination.lastPage).toBe(2);
        });
    });

    it('should reject too high a page parameter', () => {
      return request(app.getHttpServer())
        .get('/v1/organization/1/services?page=9999')
        .expect(404);
    });

    it('should reject a negative page parameter', () => {
      return request(app.getHttpServer())
        .get('/v1/organization/1/services?page=-1')
        .expect(400);
    });
  });

  describe('filtering', () => {
    it('should filter by name', () => {
      return request(app.getHttpServer())
        .get('/v1/organization/1/services?name=Currency')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.length).toBeGreaterThanOrEqual(1);
          expect(res.body.data[0].name).toContain('Currency');
        });
    });

    it('should filter by name case-insensitive', () => {
      return request(app.getHttpServer())
        .get('/v1/organization/1/services?name=currency')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.length).toBeGreaterThanOrEqual(1);
          expect(res.body.data[0].name).toContain('Currency');
        });
    });

    it('should honor any _ literally', () => {
      return request(app.getHttpServer())
        .get('/v1/organization/1/services?name=currency_')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveLength(0);
        });
    });

    it('should honor any % literally', () => {
      return request(app.getHttpServer())
        .get('/v1/organization/1/services?name=currency%')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveLength(0);
        });
    });
  });

  describe('orgId', () => {
    it('should honor orgId separation', () => {
      return request(app.getHttpServer())
        .get('/v1/organization/2/services')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveLength(0);
          expect(res.body.pagination.firstPage).toBe(0);
          expect(res.body.pagination.currentPage).toBe(0);
          expect(res.body.pagination.nextPage).toBe(null);
          expect(res.body.pagination.lastPage).toBe(0);
        });
    });

    it('should reject non-numerical orgIds', () => {
      return request(app.getHttpServer())
        .get('/v1/organization/asdf/services')
        .expect(400);
    });
  });
});
