/**
 * DonationSummaryReport - PDF-ready component for donation summary data
 * Used by reportToHtml helper to generate static HTML for PDF conversion
 */
export default function DonationSummaryReport({ 
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

    const formatVolume = (volume) => {
        if (!volume) return '0 mL';
        return `${formatNumber(volume)} mL`;
    };

    return (
        <>
            <div className="report-header">
                <h1 className="report-title">Donation Summary Report</h1>
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
                    <div className="summary-card-title">Total Donations</div>
                    <div className="summary-card-value">
                        {formatNumber(data?.summary?.totalDonations || 0)}
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-card-title">Total Volume</div>
                    <div className="summary-card-value">
                        {formatVolume(data?.summary?.totalVolume || 0)}
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-card-title">Unique Donors</div>
                    <div className="summary-card-value">
                        {formatNumber(data?.summary?.uniqueDonors || 0)}
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-card-title">Avg Volume/Donation</div>
                    <div className="summary-card-value">
                        {formatVolume(data?.summary?.avgVolume || 0)}
                    </div>
                </div>
            </div>

            {/* Donations by Blood Type */}
            {data?.byBloodType && data.byBloodType.length > 0 && (
                <>
                    <h3 style={{ marginBottom: '15px', color: '#374151' }}>
                        Donations by Blood Type
                    </h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Blood Type</th>
                                <th className="text-center">Count</th>
                                <th className="text-center">Total Volume (mL)</th>
                                <th className="text-center">Avg Volume (mL)</th>
                                <th className="text-right">% of Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.byBloodType.map((item, index) => {
                                const percentage = data.summary?.totalDonations 
                                    ? ((item.count / data.summary.totalDonations) * 100).toFixed(1)
                                    : '0.0';
                                
                                return (
                                    <tr key={index}>
                                        <td className="font-medium">{item.blood_type || 'Unknown'}</td>
                                        <td className="text-center">{formatNumber(item.count)}</td>
                                        <td className="text-center">{formatNumber(item.totalVolume)}</td>
                                        <td className="text-center">{formatNumber(item.avgVolume)}</td>
                                        <td className="text-right">{percentage}%</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </>
            )}

            {/* Monthly Trends */}
            {data?.monthlyTrends && data.monthlyTrends.length > 0 && (
                <>
                    <h3 style={{ marginBottom: '15px', color: '#374151', marginTop: '30px' }}>
                        Monthly Donation Trends
                    </h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th className="text-center">Donations</th>
                                <th className="text-center">Total Volume (mL)</th>
                                <th className="text-center">Unique Donors</th>
                                <th className="text-center">Avg Volume (mL)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.monthlyTrends.map((item, index) => (
                                <tr key={index}>
                                    <td className="font-medium">{item.month || 'Unknown'}</td>
                                    <td className="text-center">{formatNumber(item.count)}</td>
                                    <td className="text-center">{formatNumber(item.totalVolume)}</td>
                                    <td className="text-center">{formatNumber(item.uniqueDonors)}</td>
                                    <td className="text-center">{formatNumber(item.avgVolume)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {/* No Data Message */}
            {(!data || (!data.summary && !data.byBloodType && !data.monthlyTrends)) && (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '40px', 
                    color: '#6b7280',
                    fontStyle: 'italic'
                }}>
                    No donation data available for the selected filters.
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
