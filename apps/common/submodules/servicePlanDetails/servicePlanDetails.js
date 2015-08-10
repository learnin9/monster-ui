define(function(require){
	var $ = require('jquery'),
		_ = require('underscore'),
		monster = require('monster');

	var servicePlanDetails = {

		requests: {},

		subscribe: {
			'common.servicePlanDetails.render': 'servicePlanDetailsRender'
		},

		/* Arguments:
		** container: jQuery Div
		** servicePlan: servicePlanId or servicePlan data
		** useOwnPlans: if true, get the plan details from the account own plans, instead of its reseller's ones
		** callback: callback executed once we rendered the number control
		*/
		servicePlanDetailsRender: function(args) {
			var self = this,
				container = args.container,
				servicePlan = args.servicePlan || null,
				useOwnPlans = args.useOwnPlans || false,
				callback = args.callback,
				accountId = args.accountId || self.accountId;

			if(container) {
				if(typeof servicePlan === 'string') {
					self.callApi({
						resource: useOwnPlans ? 'servicePlan.get' : 'servicePlan.getAvailable',
						data: {
							accountId: accountId,
							planId: servicePlan
						},
						success: function(data, status) {
							self.renderServicePlanDetails(container, data.data, callback);
						}
					});
				} else {
					self.renderServicePlanDetails(container, servicePlan, callback);
				}
			} else {
				throw "You must provide a container!";
			}
		},

		// We use the same view to display 2 different API GET /service_plan/available/xxx and /current, so we use this function to format them the same
		servicePlanDetailsFormatData: function(servicePlanData) {
			var self = this,
				formattedData = {
					servicePlan: {}
				};

			if(servicePlanData.hasOwnProperty('items') && !servicePlanData.hasOwnProperty('plan')) {
				servicePlanData.plan = servicePlanData.items;
			}

			formattedData.servicePlan = servicePlanData;

			return formattedData;
		},

		renderServicePlanDetails: function(container, servicePlanData, callback) {
			var self = this,
				formattedData = self.servicePlanDetailsFormatData(servicePlanData),
				template = $(monster.template(self, 'servicePlanDetails-layout', formattedData));

			monster.ui.tooltips(template);

			container.empty().append(template);

			callback && callback({
				template: template,
				data: servicePlanData
			});
		}
	}

	return servicePlanDetails;
});
