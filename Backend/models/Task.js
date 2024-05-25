const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const taskSchema = mongoose.Schema(
    {
        user: {
            type: ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        content: {
            type: String,
            required: false,
            trim: true,
        },
        field: {
            type: String,
            required: [true, "Field is required"],
            trim: true,
            default: "overall",
        },
        priority: {
            type: String,
            required: [true, "Priority is required"],
            enum: ["Low", "Medium", "High"],
            default: "Medium",
        },
        is_done: {
            type: Boolean,
            default: false,
        },
        deadline: {
            type: Date,
            required: false,
        },
        created_at: {
            type: Date,
            default: Date.now,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Task", taskSchema);
