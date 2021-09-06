import mongoose from "mongoose";

const VerificationCodeSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        code: {
            type: Number,
            required: true
        },
        valid: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    { timestamps: true }
);

const VerificationCode = mongoose.model("VerificationCode", VerificationCodeSchema);
export default VerificationCode;
