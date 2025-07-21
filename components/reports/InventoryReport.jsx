/**
 * InventoryReport - PDF-ready component for blood inventory data
 * Used by reportToHtml helper to generate static HTML for PDF conversion
 */
export default function InventoryReport({ 
    data, 
    filters = {},
    generatedAt = new Date().toISOString()
}) {
    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatNumber = (num) => {
        if (num === null || num === undefined) return '0';
        return Number(num).toLocaleString();
    };

    const getStockStatusBadge = (status) => {
        const statusMap = {
            'Available': 'status-available',
            'Low Stock': 'status-low',
            'Critical': 'status-critical'
        };
        return statusMap[status] || 'status-available';
    };

    return (
        <>
            <div className="report-header">
                <h1 className="report-title">Blood Inventory Report</h1>
                <p className="report-subtitle">
                    Generated on {formatDate(generatedAt)} | PCMC Blood Bank Portal
                </p>
            </div>

            {/* Filters Applied */}
            <div className="filters-section">
                <h3 className="filters-title">Report Filters Applied:</h3>
                <div className="filter-item">
                    <span className="filter-label">Date Range:</span>{' '}
                    <span className="filter-value">
                        {filters.startDate ? formatDate(filters.startDate) : 'All time'} - {' '}
                        {filters.endDate ? formatDate(filters.endDate) : 'Present'}
                    </span>
                </div>
                {filters.agency && filters.agency !== 'ALL' && (
                    <div className="filter-item">
                        <span className="filter-label">Agency:</span>{' '}
                        <span className="filter-value">{filters.agency}</span>
                    </div>
                )}
                {filters.bloodType && filters.bloodType !== 'ALL' && (
                    <div className="filter-item">
                        <span className="filter-label">Blood Type:</span>{' '}
                        <span className="filter-value">{filters.bloodType}</span>
                    </div>
                )}
            </div>

            {/* Summary Cards */}
            <div className="summary-cards">
                <div className="summary-card">
                    <div className="summary-card-title">Total Units Available</div>
                    <div className="summary-card-value">
                        {formatNumber(data?.summary?.totalUnits || 0)}
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-card-title">Recent Collections</div>
                    <div className="summary-card-value">
                        {formatNumber(data?.summary?.recentCollections || 0)}
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-card-title">Pending Requests</div>
                    <div className="summary-card-value">
                        {formatNumber(data?.summary?.pendingRequests || 0)}
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-card-title">Blood Types in Stock</div>
                    <div className="summary-card-value">
                        {formatNumber(data?.byBloodType?.length || 0)}
                    </div>
                </div>
            </div>

            {/* Inventory by Blood Type */}
            {data?.byBloodType && data.byBloodType.length > 0 && (
                <>
                    <h3 style={{ marginBottom: '15px', color: '#374151' }}>
                        Current Inventory by Blood Type
                    </h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Blood Type</th>
                                <th className="text-center">Units Available</th>
                                <th className="text-center">Recent Collections</th>
                                <th className="text-center">Pending Requests</th>
                                <th className="text-center">Stock Status</th>
                                <th className="text-right">% of Total Inventory</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.byBloodType.map((item, index) => {
                                const percentage = data.summary?.totalUnits 
                                    ? ((item.unitsAvailable / data.summary.totalUnits) * 100).toFixed(1)
                                    : '0.0';
                                
                                return (
                                    <tr key={index}>
                                        <td className="font-medium">{item.blood_type || 'Unknown'}</td>
                                        <td className="text-center">{formatNumber(item.unitsAvailable)}</td>
                                        <td className="text-center">{formatNumber(item.recentCollections)}</td>
                                        <td className="text-center">{formatNumber(item.pendingRequests)}</td>
                                        <td className="text-center">
                                            <span className={`status-badge ${getStockStatusBadge(item.stockStatus)}`}>
                                                {item.stockStatus || 'Available'}
                                            </span>
                                        </td>
                                        <td className="text-right">{percentage}%</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </>
            )}

            {/* Recent Collections */}
            {data?.recentCollections && data.recentCollections.length > 0 && (
                <>
                    <h3 style={{ marginBottom: '15px', color: '#374151', marginTop: '30px' }}>
                        Recent Collections (Last 30 Days)
                    </h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Collection Date</th>
                                <th>Blood Type</th>
                                <th className="text-center">Volume (mL)</th>
                                <th>Donor Name</th>
                                <th>Event/Agency</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.recentCollections.slice(0, 20).map((item, index) => (
                                <tr key={index}>
                                    <td>{formatDate(item.collection_date)}</td>
                                    <td className="font-medium">{item.blood_type || 'Unknown'}</td>
                                    <td className="text-center">{formatNumber(item.volume)}</td>
                                    <td>{item.donor_name || 'Anonymous'}</td>
                                    <td className="text-muted">{item.event_name || item.agency_name || 'Walk-in'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {data.recentCollections.length > 20 && (
                        <p style={{ fontSize: '10px', color: '#6b7280', fontStyle: 'italic', marginTop: '10px' }}>
                            Showing first 20 of {data.recentCollections.length} recent collections.
                        </p>
                    )}
                </>
            )}

            {/* Pending Requests */}
            {data?.pendingRequests && data.pendingRequests.length > 0 && (
                <>
                    <h3 style={{ marginBottom: '15px', color: '#374151', marginTop: '30px' }}>
                        Pending Blood Requests
                    </h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Request Date</th>
                                <th>Blood Type</th>
                                <th className="text-center">Units Requested</th>
                                <th>Urgency</th>
                                <th>Hospital/Requester</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.pendingRequests.slice(0, 15).map((item, index) => (
                                <tr key={index}>
                                    <td>{formatDate(item.request_date)}</td>
                                    <td className="font-medium">{item.blood_type || 'Unknown'}</td>
                                    <td className="text-center">{formatNumber(item.units_requested)}</td>
                                    <td>
                                        <span className={`status-badge ${
                                            item.urgency === 'Emergency' ? 'status-critical' : 
                                            item.urgency === 'Urgent' ? 'status-low' : 'status-available'
                                        }`}>
                                            {item.urgency || 'Normal'}
                                        </span>
                                    </td>
                                    <td>{item.requester_name || 'Unknown'}</td>
                                    <td className="text-muted">{item.status || 'Pending'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {data.pendingRequests.length > 15 && (
                        <p style={{ fontSize: '10px', color: '#6b7280', fontStyle: 'italic', marginTop: '10px' }}>
                            Showing first 15 of {data.pendingRequests.length} pending requests.
                        </p>
                    )}
                </>
            )}

            {/* No Data Message */}
            {(!data || (!data.summary && !data.byBloodType && !data.recentCollections && !data.pendingRequests)) && (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '40px', 
                    color: '#6b7280',
                    fontStyle: 'italic'
                }}>
                    No inventory data available for the selected filters.
                </div>
            )}

            {/* Footer */}
            <div style={{ 
                marginTop: '40px', 
                paddingTop: '20px', 
                borderTop: '1px solid #e5e7eb',
                fontSize: '10px',
                color: '#9ca3af',
                textAlign: 'center'
            }}>
                <p>This report was generated from the PCMC Blood Bank Portal database.</p>
                <p>For questions or data discrepancies, please contact the system administrator.</p>
            </div>
        </>
    );
}
