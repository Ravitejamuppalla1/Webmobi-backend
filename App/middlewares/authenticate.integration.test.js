const request = require("supertest")
const express = require("express")
const jwt = require("jsonwebtoken")
const userAuthenticate = require("./authenticate")

const app = express()

app.use((req, res, next) => {
  req.user = { id: "mockUserId", username: "mockUsername" }
  next()
})

app.get("/secure", userAuthenticate, (req, res) => {
  res.json({ message: "Access granted", user: req.user })
});

describe("Integration tests for userAuthenticate middleware", () => {
  it("should allow access with valid token", async () => {
    const mockToken = jwt.sign(
      { id: "mockUserId", username: "mockUsername" },
      process.env.SECRET_KEY
    )
    const response = await request(app)
      .get("/secure")
      .set("Authorization", `Bearer ${mockToken}`)

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Access granted")
    expect(response.body).toHaveProperty("user")
    expect(response.body.user).toEqual({
      id: "mockUserId",
      username: "mockUsername",
    })
  })

  it("should return 401 with invalid token", async () => {
    const invalidToken = "invalidToken"
    const response = await request(app)
      .get("/secure")
      .set("Authorization", `Bearer ${invalidToken}`)

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "Access denied")
  })

  it("should return 401 without token", async () => {
    const response = await request(app).get("/secure")

    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty("error", "Access denied")
  })
})
