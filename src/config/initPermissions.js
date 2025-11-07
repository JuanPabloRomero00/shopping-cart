const Permission = require('../models/permission');

const initPermissions = async () => {
  try {
    const permissions = [
      // Auth-related permissions
      { name: 'register_user' },
      { name: 'login_user' },
      { name: 'create_admin' },

      // User-related permissions
      { name: 'create_user' },
      { name: 'read_users' },
      { name: 'read_user_by_id' },
      { name: 'update_user' },
      { name: 'delete_user' },

      // Role-related permissions
      { name: 'create_role' },
      { name: 'read_roles' },
      { name: 'assign_permission_to_role' },
      { name: 'remove_permission_from_role' },
      { name: 'assign_role_to_user' },
      { name: 'remove_role_from_user' },

      // Permission-related permissions
      { name: 'create_permission' },
      { name: 'read_permissions' },
      { name: 'update_permission' },
      { name: 'delete_permission' },

      // Product-related permissions
      { name: 'create_product' },
      { name: 'read_products' },
      { name: 'update_product' },
      { name: 'delete_product' },

      // Cart-related permissions
      { name: 'add_to_cart' },
      { name: 'remove_from_cart' },
      { name: 'view_cart' },
    ];

    // Insert permissions into the database mi coleccion de base de datos se llama permissions
    for (const permission of permissions) {
      const exists = await Permission.findOne({ name: permission.name });
      if (!exists) {
        await Permission.create(permission);
      }
    }

    console.log('Permissions initialized successfully.');
  } catch (error) {
    console.error('Error initializing permissions:', error);
  }
};

// Ensure the script runs when executed directly
if (require.main === module) {
  const connectDB = require('./db'); // Import the correct function

  connectDB() // Use the correct function name
    .then(() => {
      console.log('Database connected successfully.');
      return initPermissions();
    })
    .then(() => {
      console.log('Permissions initialization completed.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error during permissions initialization:', error);
      process.exit(1);
    });
}

module.exports = initPermissions;