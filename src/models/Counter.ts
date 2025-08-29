import mongoose, { Document, Schema } from 'mongoose'

interface ICounter extends Document {
  _id: string
  sequence: number
}

const CounterSchema = new Schema<ICounter>({
  _id: {
    type: String,
    required: true
  },
  sequence: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: false // We don't need timestamps for counters
})

const Counter = mongoose.models.Counter || mongoose.model<ICounter>('Counter', CounterSchema)

export default Counter
