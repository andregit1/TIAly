const { 
    sequelize,
    assert,
    request,
    app,
    bcrypt,
    User,
    Role
 } = require('./sequelize-test-setup'); // Import User, Role, and sequelize from sequelize-test-setup

describe('Auth Controller', () => {
    describe('signup', () => {
        it('should create a new user', (done) => {
            const userData = {
                username: 'testuser',
                password: 'testpassword',
                roleId: null
            };

            request(app)
                .post('/auth/signup')
                .send(userData)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body.message, 'User created successfully');
                    assert(res.body.user);
                    done();
                });
        });

        it('should handle errors during user creation', (done) => {
            const userData = {
                username: 'testuser1',
                password: 'testpassword',
                roleId: 999 // Assuming roleId does not exist
            };

            request(app)
                .post('/auth/signup')
                .send(userData)
                .expect(400) // Expecting a 400 Bad Request for invalid roleId
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body.message, 'Bad request');
                    done();
                });
        });
    });

    describe('signin', () => {
        before(async () => {
            // Create a user for testing sign-in
            const hashedPassword = await bcrypt.hash('testpassword', 10);
            await User.create({ username: 'testuser', password: hashedPassword });
        });

        it('should sign in a user', (done) => {
            request(app)
                .post('/auth/signin')
                .send({ username: 'testuser', password: 'testpassword' })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body.message, 'Signed in successfully');
                    assert(res.body.user);
                    done();
                });
        });

        it('should handle authentication failure', (done) => {
            request(app)
                .post('/auth/signin')
                .send({ username: 'invaliduser', password: 'invalidpassword' })
                .expect(401)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body.message, 'Unauthorized');
                    done();
                });
        });

        it('should handle authentication error', (done) => {
            // Simulate an error by sending incomplete data
            request(app)
                .post('/auth/signin')
                .send({})
                .expect(400) // Expecting a 400 Bad Request for incomplete data
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body.message, 'Username and password are required');
                    done();
                });
        });
    });

    describe('signout', () => {
        it('should sign out the user', (done) => {
            request(app)
                .get('/auth/signout')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body.message, 'Signed out successfully');
                    done();
                });
        });

        it('should handle signout error', (done) => {
            request(app)
                .get('/non-existing-route')
                .expect(500)
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });
        });
    });
});
