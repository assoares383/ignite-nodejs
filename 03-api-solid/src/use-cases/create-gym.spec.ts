import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { beforeEach, describe, expect, test } from 'vitest';
import { GymUseCase } from './create-gym';

let gymsRepository: InMemoryGymsRepository
let sut: GymUseCase

describe('Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new GymUseCase(gymsRepository)
  })
  test('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: -23.5505,
      longitude: -46.6333,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
