import React from 'react';

interface VerticalData {
    vertical: string;
    count: number;
}

interface MemberCountCardProps {
    data: VerticalData[];
    loading?: boolean;
    title?: string;
    showTotal?: boolean;
}

const MemberCountCard: React.FC<MemberCountCardProps> = ({
    data,
    loading = false,
    title = "Member Statistics",
    showTotal = true
}) => {
    const totalMembers = data.reduce((sum, item) => sum + item.count, 0);

    if (loading) {
        return (
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6 mb-8 transition-colors">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{title}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-100 dark:bg-slate-800 rounded-lg p-4 h-20"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6 mb-8 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
                {showTotal && (
                    <div className="mt-2 sm:mt-0 inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 shadow-md">
                        <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm font-medium text-white">
                            Total: <span className="font-bold">{totalMembers}</span> members
                        </span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {data.map((item) => (
                    <div
                        key={item.vertical}
                        className="bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700/60 rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary-300 dark:hover:border-primary-500/50"
                    >
                        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate mb-2" title={item.vertical}>
                            {item.vertical}
                        </h3>
                        <div className="flex items-baseline gap-1">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {item.count}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">members</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Single vertical card for Vertical Head Dashboard
interface SingleVerticalCardProps {
    vertical: string;
    count: number;
    loading?: boolean;
}

export const SingleVerticalCard: React.FC<SingleVerticalCardProps> = ({
    vertical,
    count,
    loading = false
}) => {
    if (loading) {
        return (
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6 mb-8 transition-colors">
                <div className="animate-pulse flex items-center justify-between">
                    <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
                    <div className="h-16 bg-gray-200 dark:bg-slate-700 rounded w-24"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6 mb-8 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Your Vertical</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{vertical}</p>
                </div>
                <div className="inline-flex items-center px-5 py-3 rounded-lg bg-primary-600 shadow-md">
                    <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-sm font-medium text-white">
                        <span className="font-bold text-lg">{count}</span> Members
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MemberCountCard;
