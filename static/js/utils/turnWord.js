function NumTurnWord (rule, id) {
	for(var key in rule) {
		if(id == key) {
			return rule[key];
		}
	}
}