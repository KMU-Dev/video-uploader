import { getRepository, Repository } from "typeorm";
import { Target } from "../entity/Target";
import { TargetConig } from "../model/config";
import { ModelMapper } from "../util/mapper";
import { ArrayMapper } from "../util/mapper/mappers";

export default class TargetService {
    private static instance: TargetService;

    private targetRepository: Repository<Target>;

    private constructor() {
        this.targetRepository = getRepository(Target);
    }

    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    async updateTargets(targetConfigs: TargetConig[]) {
        const mapper = new ArrayMapper<Target>(new ModelMapper<TargetConig, Target>());
        const newTargets = await mapper.map(targetConfigs);

        const targets = await this.getTargets();

        const finalTargets = newTargets.map((target) => {
            const foundTarget = targets.find(element => element.name == target.name); // database target
            if (foundTarget) target.id = foundTarget.id;
            return target;
        });

        await this.targetRepository.save(finalTargets);
    }

    getTargets() {
        return this.targetRepository.find();
    }
}
