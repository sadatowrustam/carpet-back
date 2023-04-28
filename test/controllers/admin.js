const axios = require("../test-helpers/axios");

const adminTemplate = {
  id: null,
  username: "AdminAdmin",
  password: "123123",
  token: null,
};

module.exports = () => {
  describe("Admin controller", () => {
    it("Create one admin", async () => {
      let { data } = await axios.post("/admins", adminTemplate);
      const { admin, token } = data.data;

      expect(data).not.toBeNull();
      expect(admin).toBeInstanceOf(Object);
      expect(token).toBeDefined();
      expect(admin.username).toBe(adminTemplate.username);
    });

    it("Login to admin", async () => {
      let { data } = await axios.post("/admins/login", adminTemplate);
      const { admin, token } = data.data;
      adminTemplate.token = token;
      adminTemplate.id = admin.id;

      expect(admin).toBeInstanceOf(Object);
      expect(token).toBeDefined();
      expect(admin.id).toBeDefined();
    });

    it("Delete admin", async () => {
      const { data } = await axios.delete(`/admins/${adminTemplate.id}`, {
        headers: {
          Authorization: `Bearer ${adminTemplate.token}`,
        },
      });

      const { code, adminId } = data;

      expect(code).toBe(200);
      expect(adminId).not.toBeNull();
      expect(adminId).toBe(adminTemplate.id);
    });
  });
};
