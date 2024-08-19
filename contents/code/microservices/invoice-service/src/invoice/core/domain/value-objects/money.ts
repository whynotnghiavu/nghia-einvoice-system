import { DomainException } from '@vuvannghia/common';

export class Money {
  value: number;

  constructor(value: number) {
    this.value = value;
  }

  add(money: Money): Money {
    return new Money(this.value + money.value);
  }

  subtract(money: Money): Money {
    return new Money(this.value - money.value);
  }

  multiply(factor: number): Money {
    return new Money(this.value * factor);
  }

  divide(divisor: number): Money {
    if (divisor === 0) {
      throw new DomainException('Không thể chia cho 0');
    }
    return new Money(this.value / divisor);
  }
}
