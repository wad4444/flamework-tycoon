import { Service, OnStart } from "@flamework/core";
import { BaseTycoonItem, TycoonComponent, TycoonItem, TycoonService } from "@rbxts/flamework-tycoon";
import { Players, Workspace } from "@rbxts/services";

const model = Workspace.FindFirstChild("Tycoon") as Model;

@Service({
	loadOrder: 0,
})
export class TestService implements OnStart {
	private tycoon!: TycoonComponent;

	constructor(private tycoonService: TycoonService) {}

	public onStart() {
		this.tycoon = this.tycoonService.Create(model);

		Players.PlayerAdded.Connect((player) => {
			this.tycoon.Claim(player);
		});
	}
}

@TycoonItem({
	tag: `${ATM}`,
})
class ATM extends BaseTycoonItem<{}, Model> {
	protected generateData() {
		return {};
	}

	public async onUnlocked() {
		const tycoon = this.GetTycoon();
		if (!tycoon.HaveOwner()) return;

		this.instance.PrimaryPart?.Touched.Connect((hit) => {
			if (!tycoon.VerifyOwnerByCharacter(hit.Parent)) return;

			this.Lock();
		});
	}

	public async onLocked() {
		task.wait(5);
		this.Unlock();
	}
}
