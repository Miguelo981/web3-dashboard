import { useRef, useState } from "react";

type SearchFormProps = {
    onSearch: (keyword: string) => void;
    onType?: (keyword: string) => void;
    className?: string;
}

export const SearchForm = ({ onSearch, className, onType }: SearchFormProps) => {
    const [keyword, setKeyword] = useState("");
    const searchInput = useRef<HTMLInputElement>();

    const handleClick = () => { onSearch(keyword) }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        onSearch(keyword);
    }

    const handleChange = (event: any) => {
        setKeyword(event.target.value);

        if (!onType) return;

        onType(event.target.value);
    }

    const handleClean = (event) => {
        setKeyword("");
        searchInput.current.value = "";
    }

    return (
        <form onSubmit={handleSubmit} className={className}>
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">Search</label>
            <div className="relative">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input type="search" ref={searchInput} onChange={handleChange} id="default-search" className="block p-4 pl-10 w-full text-sm text-gray-900 card rounded-lg border border-teal-500 focus:ring-blue-500 focus:border-blue-500 card dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search name, chain Id..." required />
                <div className="absolute right-2.5 bottom-2.5 flex">
                    { keyword.length > 0 ? 
                        <p onClick={handleClean} className="text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2 cursor-pointer"><strong>X</strong></p>
                    : null }
                    <button type="submit" onClick={handleClick} className="text-white app-btn focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"><strong>Search</strong></button>
                </div>

            </div>
        </form>

    )
}