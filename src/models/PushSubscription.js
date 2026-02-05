import mongoose, { Schema, models } from "mongoose";

const pushSchema = new Schema({
    userId: { type: String, required: true, unique: true },
    subscription: { type: Object, required: true } 
});

const PushSubscription = models.PushSubscription || mongoose.model("PushSubscription", pushSchema);
export default PushSubscription;