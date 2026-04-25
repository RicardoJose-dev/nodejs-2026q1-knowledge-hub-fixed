import { ValidationError } from 'src/common/errors/custom.errors';
import { CustomParseUUIDPipe } from '../CustomParseUUIDPipe';

describe('CustomParseUUIDPipe', () => {
  let pipe: CustomParseUUIDPipe;

  beforeEach(() => {
    pipe = new CustomParseUUIDPipe();
  });

  it('should return the value if it is a valid UUID', () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000';
    expect(pipe.transform(uuid)).toBe(uuid);
  });

  it('should throw ValidationError if value is not a valid UUID', () => {
    expect(() => pipe.transform('not-a-uuid')).toThrow(ValidationError);
  });
});
