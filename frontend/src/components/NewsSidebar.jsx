import React, { useEffect } from 'react';
import { useNewsStore } from '../store/useNewsStore';
import { Flame, ExternalLink } from 'lucide-react';

const NewsSidebar = () => {
    const { articles, fetchNews, isNewsLoading } = useNewsStore();

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    if (isNewsLoading) {
        return (
            <aside className="h-full w-72 border-l border-base-300 bg-base-200 hidden xl:flex flex-col p-4 items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </aside>
        );
    }

    return (
        <aside className="h-full w-72 border-l border-base-300 bg-base-200 hidden xl:flex flex-col transition-all duration-300 ease-in-out">
            <div className="border-b border-base-300 p-5">
                <h2 className="font-bold flex items-center gap-2 text-base-content">
                    <Flame className="text-orange-500" size={20} />
                    Trending Tech
                </h2>
            </div>

            <div className="overflow-y-auto w-full p-4 space-y-4 flex-1">
                {articles.map((article) => (
                    <div key={article.id} className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow border border-base-300">
                        {article.thumbnail && (
                            <figure className="px-4 pt-4">
                                <img src={article.thumbnail} alt="thumbnail" className="rounded-xl h-24 w-full object-cover" />
                            </figure>
                        )}
                        <div className="card-body p-4">
                            <h3 className="card-title text-sm leading-tight text-base-content">
                                {article.title}
                            </h3>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-base-content/50">u/{article.author}</span>
                                <a 
                                    href={article.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn btn-xs btn-ghost btn-circle"
                                >
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default NewsSidebar;