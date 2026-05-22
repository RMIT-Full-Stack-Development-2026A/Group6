export interface Operator {
	name: string
	gender: string
	race: string
}

export const operators: Operator[] = [
	{ name: "Angelina", race: "Vulpo", gender: "Female" },
	{ name: "Gilberta", race: "Vulpo", gender: "Female" },
	{ name: "Eyjafjalla", race: "Caprinae", gender: "Female" },
	{ name: "Ardelia", race: "Caprinae", gender: "Female" },
	{ name: "Elysium", race: "Liberi", gender: "Male" },
	{ name: "Thorns", race: "Ægir", gender: "Male" },
]

export function getOperators(): Operator[] {
	return operators
}

export async function fetchOperators(): Promise<Operator[]> {
	return Promise.resolve(operators)
}

export default fetchOperators

