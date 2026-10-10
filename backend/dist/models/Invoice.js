"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invoice = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const InvoiceItemSchema = new mongoose_1.Schema({
    description: { type: String, required: true },
    department: { type: String, default: "General" },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
});
const InvoiceSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
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
exports.Invoice = mongoose_1.default.model("Invoice", InvoiceSchema);
