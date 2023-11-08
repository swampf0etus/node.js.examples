import fs from 'node:fs/promises';

export const loadData = async () => {
  console.log('Loading employee data');
  try {
    const fileData = await fs.readFile('./data.json', 'utf8');
    // employees = JSON.parse(fileData);
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Failed to load data.json');
    throw error;
  }
};

export const writeData = async (employees) => {
  console.log('Writing employee data');
  try {
    await fs.writeFile('./data.json', JSON.stringify(employees, null, 2));
  } catch (error) {
    console.error('Failed to write data.json');
    throw error;
  }
};
