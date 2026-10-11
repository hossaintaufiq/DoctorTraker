"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetDatabase = resetDatabase;
const seeder_js_1 = require("../utils/seeder.js");
/**
 * @desc    Wipe all collections and reseed with fresh baseline data
 * @route   POST /api/system/reset-database
 * @access  Public (for administrative reset operations)
 */
async function resetDatabase(req, res) {
    try {
        console.log("[System Control] Initiating full database wipe and reseed requested by client...");
        const result = await (0, seeder_js_1.seedDatabase)();
        return res.status(200).json({
            success: true,
            message: "Database has been completely wiped and reseeded with pristine fresh records.",
            data: result,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error("[System Control Error] Reset failed:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to reset database: " + error.message,
        });
    }
}
