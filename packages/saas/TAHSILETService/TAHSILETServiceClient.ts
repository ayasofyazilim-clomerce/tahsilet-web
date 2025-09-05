import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { Interceptors } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';

import { AbpApiDefinitionService } from './sdk.gen';
import { AbpApplicationConfigurationService } from './sdk.gen';
import { AbpApplicationLocalizationService } from './sdk.gen';
import { AbpTenantService } from './sdk.gen';
import { AccountService } from './sdk.gen';
import { DynamicClaimsService } from './sdk.gen';
import { EmailSettingsService } from './sdk.gen';
import { FeaturesService } from './sdk.gen';
import { LoginService } from './sdk.gen';
import { MemberService } from './sdk.gen';
import { PermissionsService } from './sdk.gen';
import { ProfileService } from './sdk.gen';
import { RoleService } from './sdk.gen';
import { TenantService } from './sdk.gen';
import { TimeZoneSettingsService } from './sdk.gen';
import { TransactionService } from './sdk.gen';
import { UserService } from './sdk.gen';
import { UserLookupService } from './sdk.gen';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class TAHSILETServiceClient {

	public readonly abpApiDefinition: AbpApiDefinitionService;
	public readonly abpApplicationConfiguration: AbpApplicationConfigurationService;
	public readonly abpApplicationLocalization: AbpApplicationLocalizationService;
	public readonly abpTenant: AbpTenantService;
	public readonly account: AccountService;
	public readonly dynamicClaims: DynamicClaimsService;
	public readonly emailSettings: EmailSettingsService;
	public readonly features: FeaturesService;
	public readonly login: LoginService;
	public readonly member: MemberService;
	public readonly permissions: PermissionsService;
	public readonly profile: ProfileService;
	public readonly role: RoleService;
	public readonly tenant: TenantService;
	public readonly timeZoneSettings: TimeZoneSettingsService;
	public readonly transaction: TransactionService;
	public readonly user: UserService;
	public readonly userLookup: UserLookupService;

	public readonly request: BaseHttpRequest;

	constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
		this.request = new HttpRequest({
			BASE: config?.BASE ?? '',
			VERSION: config?.VERSION ?? '1',
			WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
			CREDENTIALS: config?.CREDENTIALS ?? 'include',
			TOKEN: config?.TOKEN,
			USERNAME: config?.USERNAME,
			PASSWORD: config?.PASSWORD,
			HEADERS: config?.HEADERS,
			ENCODE_PATH: config?.ENCODE_PATH,
			interceptors: {
				request: config?.interceptors?.request ?? new Interceptors(),
				response: config?.interceptors?.response ?? new Interceptors(),
      },
		});

		this.abpApiDefinition = new AbpApiDefinitionService(this.request);
		this.abpApplicationConfiguration = new AbpApplicationConfigurationService(this.request);
		this.abpApplicationLocalization = new AbpApplicationLocalizationService(this.request);
		this.abpTenant = new AbpTenantService(this.request);
		this.account = new AccountService(this.request);
		this.dynamicClaims = new DynamicClaimsService(this.request);
		this.emailSettings = new EmailSettingsService(this.request);
		this.features = new FeaturesService(this.request);
		this.login = new LoginService(this.request);
		this.member = new MemberService(this.request);
		this.permissions = new PermissionsService(this.request);
		this.profile = new ProfileService(this.request);
		this.role = new RoleService(this.request);
		this.tenant = new TenantService(this.request);
		this.timeZoneSettings = new TimeZoneSettingsService(this.request);
		this.transaction = new TransactionService(this.request);
		this.user = new UserService(this.request);
		this.userLookup = new UserLookupService(this.request);
	}
}
