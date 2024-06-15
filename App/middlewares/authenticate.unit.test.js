const jwt = require("jsonwebtoken");
const userAuthenticate = require("./authenticate");

jest.mock("jsonwebtoken");

describe("userAuthenticate middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn(),
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should set req.user if token is valid", () => {
    const mockToken =
      "Bearer " +
      jwt.sign(
        { id: "mockUserId", username: "mockUsername" },
        process.env.SECRET_KEY
      );
    const mockDecodedToken = { id: "mockUserId", username: "mockUsername" };
    jwt.verify.mockReturnValueOnce(mockDecodedToken);

    req.header.mockReturnValueOnce(mockToken);

    userAuthenticate(req, res, next);

    expect(req.user).toEqual(mockDecodedToken);
    expect(next).toHaveBeenCalled();

    expect(req.header).toHaveBeenCalledWith("authorization");
    expect(jwt.verify).toHaveBeenCalledWith(
      expect.any(String),
      process.env.SECRET_KEY
    );
  });

  it("should return 401 error if token is invalid", () => {
    const invalidToken = "Bearer invalidToken";
    req.header.mockReturnValueOnce(invalidToken);

    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    userAuthenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Access denied" });

    expect(req.header).toHaveBeenCalledWith("authorization");
    expect(jwt.verify).toHaveBeenCalledWith(
      "invalidToken",
      process.env.SECRET_KEY
    );
  });

  it("should return 401 error if no token is provided", () => {
    req.header.mockReturnValueOnce(undefined);

    userAuthenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Access denied" });

    expect(req.header).toHaveBeenCalledWith("authorization");
  });
});
