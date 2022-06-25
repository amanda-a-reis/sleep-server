import request from 'supertest';
import bcrypt from 'bcrypt'

describe('/api/users/auth', () => {
  let server;
  beforeAll(async () => {
    const mod = await import('../../index');
    server = (mod).default;
  });

  
  it('deve retornar código 201 quando são enviados dados do sono', async () => {
      const res = await request(server)
      .post('/sleep')
      .send({"data" : {
        date: '01-01-2001', 
        sleepHour: '22:00', 
        wakeUpHour: '21:00', 
        user: 'mail@mail.com'
      }});
      expect(res.status).toBe(201);
    });
    it('deve retornar código 200 quando solicitados os dados', async () => {
        const res = await request(server)
        .get('/sleep')
        .send({"data" : {
            date: '01-01-2001', 
            sleepHour: '22:00', 
            wakeUpHour: '21:00', 
            user: 'mail@mail.com'
          }});
        
        expect(res.status).toBe(200);
      });
      it('deve retornar código 200 quando criar um usuário', async () => {
        const res = await request(server)
        .post('/user/signup')
        .send({
            firstName: 'user',
            lastName: 'user',
            email: 'testando_email@mail.com',
            password: 'password123',
            confirmPassword: 'password123'
          })
        .expect(response => {console.log(response)})
        
        
        expect(res.status).toBe(200);
      });
      it('deve retornar código 200 quando o usuário tentar fazer login', async () => {
        const res = await request(server)
        .post('/user/signin')
        .send({
            email: 'teste@mail.com',
            password: '123'
          })
        .expect(response => {console.log(response)})
        
        
        expect(res.status).toBe(200);
      });
});

