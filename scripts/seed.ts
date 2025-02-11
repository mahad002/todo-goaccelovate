const { MongoClient, ObjectId } = require('mongodb');
const { hash } = require('bcryptjs');

// Admin user credentials from the test file
const ADMIN_USER = {
  email: 'admin00@email.com',
  password: 'admin00',
  username: 'admin00'
};

async function seed() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env');
  }

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();

    // Clear existing data
    await db.collection('users').deleteMany({});
    await db.collection('todos').deleteMany({});

    // Create admin user
    const hashedPassword = await hash(ADMIN_USER.password, 12);
    const user = await db.collection('users').insertOne({
      email: ADMIN_USER.email,
      password: hashedPassword,
      username: ADMIN_USER.username,
      createdAt: new Date()
    });

    // Create sample todos
    const todos = [
      {
        title: 'Welcome to your todo list!',
        completed: false,
        userId: user.insertedId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Try adding a new task',
        completed: false,
        userId: user.insertedId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Mark tasks as complete',
        completed: true,
        userId: user.insertedId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.collection('todos').insertMany(todos);

    console.log('Database seeded successfully!');
    console.log('Admin user created:');
    console.log(`Email: ${ADMIN_USER.email}`);
    console.log(`Password: ${ADMIN_USER.password}`);

    await client.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();