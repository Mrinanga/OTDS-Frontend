import React from "react";

function UserComponent() {
  return (
    <section>
      <h3>User Management</h3>
      <label>
        Username:
        <input type="text" name="username" placeholder="Enter username" />
      </label>
      <label>
        Role:
        <select name="role">
          <option value="admin">Admin</option>
          <option value="branch">Branch Office</option>
          <option value="fieldexecutive">FE</option>
        </select>
      </label>
      <label>
        Password:
        <input type="password" name="userPassword" placeholder="••••••••" />
      </label>
      <button type="button">Add User</button>
      <h4>Existing Users</h4>
      <ul>
        <li>
          admin_user - Role: Admin <button>Edit</button> <button>Delete</button>
        </li>
        <li>
          editor_01 - Role: Editor <button>Edit</button> <button>Delete</button>
        </li>
      </ul>
    </section>
  );
}

export default UserComponent;
