import mongoose, { Schema, Document } from "mongoose";

export interface IInvoiceItem {
  description: string;
  department: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface IInvoice extends Document {
  invoiceCode: string;
  patientId: string;
  patientName: string;
  patientCode: string;
  doctorId: string;
  doctorName: string;
  issueDate: string;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue" | "Processing";
  paymentMethod: "Insurance" | "Credit Card" | "Cash" | "Bank Transfer" | "Mobile Pay";
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  items: IInvoiceItem[];
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>({
  description: { type: String, required: true },
  department: { type: String, default: "General" },
  quantity: { type: Number, default: 1 },
  unitPrice: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
});

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceCode: {
      type: String,
      unique: true,
      index: true,
    },
    patientId: {
      type: String,
      required: true,
      index: true,
    },
    patientName: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
      index: true,
    },
    patientCode: {
      type: String,
      default: "",
    },
    doctorId: {
      type: String,
      required: true,
      index: true,
    },
    doctorName: {
      type: String,
      required: true,
    },
    issueDate: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10),
      index: true,
    },
    dueDate: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["Paid", "Pending", "Overdue", "Processing"],
      default: "Pending",
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Insurance", "Credit Card", "Cash", "Bank Transfer", "Mobile Pay"],
      default: "Insurance",
      index: true,
    },
    subtotal: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      index: true,
    },
    items: {
      type: [InvoiceItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate invoice code (#INV-9921)
InvoiceSchema.pre("save", function (next) {
  if (!this.invoiceCode) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.invoiceCode = `INV-${randomSuffix}`;
  }
  next();
});

// Compound indexes for financial queries
InvoiceSchema.index({ status: 1, dueDate: 1 });
InvoiceSchema.index({ patientName: "text", invoiceCode: "text", doctorName: "text" });

export const Invoice = mongoose.model<IInvoice>("Invoice", InvoiceSchema);
