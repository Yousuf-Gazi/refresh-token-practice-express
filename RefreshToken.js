const { Schema, model } = require("mongoose");
const { isAfter } = require("date-fns");

const refreshTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    issuedIp: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    replacedBytoken: String,
    expiredAt: {
      type: Date,
      required: true,
    },
    revokedAt: Date,
    revokedIp: String,
  },
  { timestamps: true }
);

refreshTokenSchema.virtual("isExpired").get(function () {
  return isAfter(new Date(), new Date(this.expiredAt));
});

refreshTokenSchema.virtual("isActive").get(function () {
  return !this.revokedAt && !this.isExpired;
});

refreshTokenSchema.set("toJSON", {
  virtuals: true,
});

const RefreshToken = model("RefreshToken", refreshTokenSchema);
module.exports = RefreshToken;