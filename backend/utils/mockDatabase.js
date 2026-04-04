// In-memory mock database for testing when MongoDB is not available
class MockDatabase {
  constructor() {
    this.users = [];
    this.policies = [];
    this.claims = [];
    this.nextUserId = 1;
    this.nextPolicyId = 1;
    this.nextClaimId = 1;
  }

  // USER OPERATIONS
  findUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  findUserById(id) {
    return this.users.find(u => u._id === id);
  }

  createUser(userData) {
    const user = {
      _id: this.nextUserId++,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  updateUser(id, updateData) {
    const user = this.findUserById(id);
    if (user) {
      Object.assign(user, updateData, { updatedAt: new Date() });
      return user;
    }
    return null;
  }

  // POLICY OPERATIONS
  findPoliciesByUserId(userId) {
    return this.policies.filter(p => p.userId === userId);
  }

  getPoliciesByUserId(userId) {
    return this.findPoliciesByUserId(userId);
  }

  findPolicyById(id) {
    return this.policies.find(p => p._id === id);
  }

  getPolicyById(id) {
    return this.findPolicyById(id);
  }

  createPolicy(policyData) {
    const policy = {
      _id: this.nextPolicyId++,
      policyNumber: `GS-${Date.now()}-${this.nextPolicyId}`,
      ...policyData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.policies.push(policy);
    return policy;
  }

  updatePolicy(id, updateData) {
    const policy = this.findPolicyById(id);
    if (policy) {
      Object.assign(policy, updateData, { updatedAt: new Date() });
      return policy;
    }
    return null;
  }

  // CLAIM OPERATIONS
  findClaimsByUserId(userId) {
    return this.claims.filter(c => c.userId === userId);
  }

  getClaimsByUserId(userId) {
    return this.findClaimsByUserId(userId);
  }

  findClaimById(id) {
    return this.claims.find(c => c._id === id);
  }

  getClaimById(id) {
    return this.findClaimById(id);
  }

  createClaim(claimData) {
    const claim = {
      _id: this.nextClaimId++,
      claimNumber: `CLAIM-${Date.now()}-${this.nextClaimId}`,
      ...claimData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.claims.push(claim);
    return claim;
  }

  updateClaim(id, updateData) {
    const claim = this.findClaimById(id);
    if (claim) {
      Object.assign(claim, updateData, { updatedAt: new Date() });
      return claim;
    }
    return null;
  }

  // UTILITY
  reset() {
    this.users = [];
    this.policies = [];
    this.claims = [];
    this.nextUserId = 1;
    this.nextPolicyId = 1;
    this.nextClaimId = 1;
  }

  getStats() {
    return {
      users: this.users.length,
      policies: this.policies.length,
      claims: this.claims.length,
    };
  }
}

module.exports = new MockDatabase();
