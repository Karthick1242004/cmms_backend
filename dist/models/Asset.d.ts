import mongoose, { Document } from 'mongoose';
export interface IAsset extends Document {
    _id: string;
    assetName: string;
    serialNo?: string;
    rfid?: string;
    parentAsset?: string;
    productName?: string;
    categoryName?: string;
    statusText: string;
    statusColor?: 'green' | 'yellow' | 'red';
    assetClass?: string;
    constructionYear?: number;
    warrantyStart?: string;
    manufacturer?: string;
    outOfOrder?: 'Yes' | 'No';
    isActive?: 'Yes' | 'No';
    category: string;
    department: string;
    size?: string;
    costPrice?: number;
    productionHoursDaily?: number;
    serviceStatus?: string;
    description?: string;
    lastEnquiryDate?: string;
    productionTime?: string;
    lineNumber?: string;
    assetType?: string;
    commissioningDate?: string;
    endOfWarranty?: string;
    expectedLifeSpan?: number;
    deleted?: 'Yes' | 'No';
    allocated?: string;
    allocatedOn?: string;
    uom?: string;
    salesPrice?: number;
    lastEnquiryBy?: string;
    shelfLifeInMonth?: number;
    location?: string;
    purchaseDate?: string;
    purchasePrice?: number;
    condition?: 'excellent' | 'good' | 'fair' | 'poor' | 'new';
    imageSrc?: string;
    partsBOM?: any[];
    meteringEvents?: any[];
    personnel?: any[];
    warrantyDetails?: any;
    businesses?: any[];
    files?: any[];
    financials?: any;
    purchaseInfo?: any;
    associatedCustomer?: any;
    log?: any[];
    createdAt: Date;
    updatedAt: Date;
}
declare const Asset: mongoose.Model<IAsset, {}, {}, {}, mongoose.Document<unknown, {}, IAsset, {}> & IAsset & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default Asset;
//# sourceMappingURL=Asset.d.ts.map