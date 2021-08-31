import mongoose  from "mongoose";

// this is for html form checkboxes which return "on" and "off" - but we want a boolean.
mongoose.Schema.Types.Boolean.convertToTrue.add('on');
mongoose.Schema.Types.Boolean.convertToFalse.add('off');

export default async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        return error;
    }
}
