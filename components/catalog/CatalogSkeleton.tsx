export default function CatalogSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Hero Skeleton (simulated by a gray block) */}
            <div className="h-64 bg-gray-200 rounded-3xl" />

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Skeleton */}
                <div className="hidden lg:flex flex-col gap-6 w-64 flex-shrink-0">
                    <div className="h-10 bg-gray-200 rounded-xl w-full" />
                    <div className="bg-gray-100 rounded-2xl h-80 w-full" />
                </div>

                {/* Grid Skeleton */}
                <div className="flex-1 space-y-6">
                    <div className="hidden lg:flex justify-between items-center">
                        <div className="h-8 bg-gray-200 rounded-lg w-48" />
                        <div className="h-6 bg-gray-200 rounded-full w-24" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-[450px]">
                                <div className="aspect-[4/5] bg-gray-100" />
                                <div className="p-5 space-y-3">
                                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                                    <div className="h-4 bg-gray-100 rounded w-full" />
                                    <div className="h-4 bg-gray-100 rounded w-2/3" />
                                    <div className="pt-4 flex gap-2">
                                        <div className="h-10 bg-gray-200 rounded-full flex-1" />
                                        <div className="h-10 bg-gray-200 rounded-full flex-1" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
