const UserAPI = {
  getUserData() {
    return new Promise((resolve) => {
      resolve({
        id: 1,
        name: "Ankush",
      });
    });
  },
};

export default UserAPI;
