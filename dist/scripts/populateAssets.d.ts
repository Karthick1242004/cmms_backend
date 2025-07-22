declare const sampleAssets: {
    assetName: string;
    serialNo: string;
    rfid: string;
    parentAsset: string;
    productName: string;
    categoryName: string;
    statusText: string;
    statusColor: string;
    assetClass: string;
    constructionYear: number;
    warrantyStart: string;
    manufacturer: string;
    outOfOrder: string;
    isActive: string;
    category: string;
    department: string;
    size: string;
    costPrice: number;
    productionHoursDaily: number;
    serviceStatus: string;
    description: string;
    lastEnquiryDate: string;
    productionTime: string;
    lineNumber: string;
    assetType: string;
    commissioningDate: string;
    endOfWarranty: string;
    expectedLifeSpan: number;
    deleted: string;
    allocated: string;
    allocatedOn: string;
    uom: string;
    salesPrice: number;
    lastEnquiryBy: string;
    shelfLifeInMonth: number;
    location: string;
    purchaseDate: string;
    purchasePrice: number;
    condition: string;
    imageSrc: string;
    partsBOM: {
        id: string;
        partName: string;
        partNumber: string;
        quantity: number;
        unitCost: number;
        supplier: string;
        lastReplaced: string;
    }[];
    meteringEvents: {
        id: string;
        eventType: string;
        reading: number;
        unit: string;
        recordedDate: string;
        recordedBy: string;
    }[];
    personnel: {
        id: string;
        name: string;
        role: string;
        email: string;
        phone: string;
        assignedDate: string;
    }[];
    warrantyDetails: {
        provider: string;
        type: string;
        startDate: string;
        endDate: string;
        coverage: string;
        terms: string;
        contactInfo: string;
        claimHistory: never[];
    };
    businesses: {
        id: string;
        name: string;
        type: string;
        contactPerson: string;
        phone: string;
    }[];
    files: {
        id: string;
        name: string;
        type: string;
        size: string;
        uploadDate: string;
        uploadedBy: string;
    }[];
    financials: {
        totalCostOfOwnership: number;
        annualOperatingCost: number;
        depreciationRate: number;
        currentBookValue: number;
        maintenanceCostYTD: number;
        fuelCostYTD: number;
    };
    purchaseInfo: {
        purchaseOrderNumber: string;
        vendor: string;
        purchaseDate: string;
        deliveryDate: string;
        terms: string;
        discount: number;
        totalCost: number;
    };
    associatedCustomer: {
        id: string;
        name: string;
        type: string;
        contactPerson: string;
        phone: string;
    };
    log: {
        id: string;
        date: string;
        action: string;
        performedBy: string;
        notes: string;
    }[];
}[];
declare function populateAssets(): Promise<void>;
export { populateAssets, sampleAssets };
//# sourceMappingURL=populateAssets.d.ts.map