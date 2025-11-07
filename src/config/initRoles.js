const Role = require('../models/role');
const Permission = require('../models/permission');
const connectDB = require('./db'); // Import the database connection

const initRoles = async () => {
  try {
    // Define roles and their permissions
    const roles = [
      {
        name: 'admin',
        permissions: [
          'register_user',
          'login_user',
          'refresh_token',
          'create_admin',
          'create_user',
          'read_users',
          'read_user_by_id',
          'create_role',
          'read_roles',
          'assign_permission_to_role',
          'remove_permission_from_role',
          'create_permission',
          'read_permissions',
          'create_product',
          'read_products',
          'update_product',
          'delete_product',
          'add_to_cart',
          'remove_from_cart',
          'view_cart',
        ],
      },
      {
        name: 'user',
        permissions: [
          'login_user',
          'refresh_token',
          'read_user_by_id',
          'read_products',
          'add_to_cart',
          'remove_from_cart',
          'view_cart',
        ],
      },
      {
        name: 'seller',
        permissions: [
          'login_user',
          'refresh_token',
          'create_product',
          'read_products',
          'update_product',
          'delete_product',
        ],
      },
    ];

    // Create roles and assign permissions
    for (const roleData of roles) {
      const { name, permissions } = roleData;

      // Find or create the role
      let role = await Role.findOne({ name });
      if (!role) {
        role = new Role({ name });
      }

      // Find permissions by name and assign them to the role
      const permissionDocs = await Permission.find({ name: { $in: permissions } });
      role.permissions = permissionDocs.map((perm) => perm._id);

      await role.save();
    }

    console.log('Roles initialized successfully.');
  } catch (error) {
    console.error('Error initializing roles:', error);
  }
};

// Ensure the script runs when executed directly
if (require.main === module) {
  connectDB()
    .then(() => {
      console.log('Database connected successfully.');
      return initRoles();
    })
    .then(() => {
      console.log('Roles initialization completed.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error during roles initialization:', error);
      process.exit(1);
    });
}

module.exports = initRoles;