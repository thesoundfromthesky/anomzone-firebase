import * as faker from 'faker';
import * as fs from 'fs-extra';

export interface Post {
  title: string;
  content: string;
}

async function generate(filename: string, size: number): Promise<void> {
  try {
    const data = Array.from({ length: size }, () => {
      return {
        title: faker.lorem.sentences(faker.random.number(3) + 1),
        content: faker.lorem.paragraphs(faker.random.number(10) + 1),
      };
    });
    await fs.outputJson('./mocks/' + filename + '.json', data, { spaces: 1 });
    console.log("JSON file generated!");
  } catch (err) {
    console.error(err);
  }
}
