import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { SetPlacesOfCourseRequestItem } from '../dto/AddPlaceToCourseRequest';
import { ConsecutivePlaceException } from '../exception/ConsecutivePlaceException';

@ValidatorConstraint({ name: 'isNotConsecutiveDuplicatePlace', async: false })
export class IsNotConsecutiveDuplicatePlace
  implements ValidatorConstraintInterface
{
  validate(places: SetPlacesOfCourseRequestItem[]) {
    for (let i = 1; i < places.length; i++) {
      if (places[i].placeId === places[i - 1].placeId) {
        throw new ConsecutivePlaceException();
      }
    }
    return true;
  }

  defaultMessage() {
    return '동일한 장소는 연속된 순서로 추가할 수 없습니다.';
  }
}
