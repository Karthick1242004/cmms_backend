import { Request, Response } from 'express';
export declare class AssetController {
    static getAllAssets(req: Request, res: Response): Promise<void>;
    static getAssetById(req: Request, res: Response): Promise<void>;
    static createAsset(req: Request, res: Response): Promise<void>;
    static updateAsset(req: Request, res: Response): Promise<void>;
    static deleteAsset(req: Request, res: Response): Promise<void>;
    static getAssetStats(req: Request, res: Response): Promise<void>;
    static bulkImportAssets(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=assetController.d.ts.map