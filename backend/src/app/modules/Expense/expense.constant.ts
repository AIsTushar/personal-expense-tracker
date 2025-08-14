
import { NestedFilter } from "../../../interfaces/nestedFiltering";
import { rangeFilteringPrams } from "../../../utils/queryBuilder";

// Fields for basic filtering
export const expenseFilterFields = [];

// Fields for top-level search
export const expenseSearchFields = [];

// Nested filtering config
export const expenseNestedFilters: NestedFilter[] = [
	// { key: "user", searchOption: "search", queryFields: ["name"] },

];

// Range-based filtering config
export const expenseRangeFilter: rangeFilteringPrams[] = [
	{
		field: "createdAt",
		maxQueryKey: "maxDate",
		minQueryKey: "minDate",
		dataType: "date",
	},
];

// Prisma include configuration
export const expenseInclude = {
	
};
