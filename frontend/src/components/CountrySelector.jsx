/* eslint-disable react/prop-types */
import { getNames } from "country-list";

export const CountrySelector = ({ onChange, value }) => {
    const countries = getNames();

    return (
        <select
            id="country"
            name="country"
            value={value}
            onChange={onChange}
            autoComplete="country-name"
            className="mt-1 block w-full border rounded-md py-2 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-500 sm:text-sm">
            {countries.map((country) => (
                <option key={country} value={country}>
                    {country}
                </option>
            ))}
        </select>
    );
};

