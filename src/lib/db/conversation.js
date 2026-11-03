import {model , Schema} from "mongoose";

const messageSchema = new Schema({
    msgId:{type: Schema.Types.ObjectId, ref: 'Message', required: true},
    sender:{type: Schema.Types.ObjectId, ref: 'User', required: true},
},
{timestamps: true}
);

const schema = new Schema({
    sender:{type: Schema.Types.ObjectId, ref: 'User', required: true},
    receiver:{type: Schema.Types.ObjectId, ref: 'User', required: true},
    messages:[messageSchema]
},
{timestamps: true});


export const Conversation = model('Conversation' , schema);