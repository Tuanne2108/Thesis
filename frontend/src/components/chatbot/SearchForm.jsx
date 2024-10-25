import React, { useState } from "react";

const SearchForm = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nhập câu hỏi của bạn"
            />
            <button type="submit">Tìm kiếm</button>
        </form>
    );
};

export default SearchForm;
