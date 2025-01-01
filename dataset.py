import json
import random

# Define scheme categories, schemes, and related attributes
scheme_names = {
    "Agriculture": [f"Agriculture Support Scheme {i+1}" for i in range(20)],
    "Banking": [f"Banking Empowerment Scheme {i+1}" for i in range(20)],
    "Business Entrepreneurship": [f"Entrepreneur Growth Scheme {i+1}" for i in range(20)],
    "Education": [f"Education Aid Program {i+1}" for i in range(20)],
    "Health": [f"Health Improvement Scheme {i+1}" for i in range(20)],
    "Housing": [f"Housing Assistance Scheme {i+1}" for i in range(20)],
    "Public Safety": [f"Safety Enhancement Scheme {i+1}" for i in range(20)],
    "Science": [f"Science Promotion Scheme {i+1}" for i in range(20)],
    "Skills": [f"Skill Development Program {i+1}" for i in range(20)],
    "Social Welfare": [f"Social Security Scheme {i+1}" for i in range(20)],
    "Sports": [f"Sports Encouragement Scheme {i+1}" for i in range(20)],
    "Transport": [f"Transport Improvement Scheme {i+1}" for i in range(20)],
    "Travel": [f"Travel Subsidy Scheme {i+1}" for i in range(20)],
    "Utility and Sanitation": [f"Sanitation and Utility Scheme {i+1}" for i in range(20)],
    "Women and Child": [f"Women and Child Welfare Scheme {i+1}" for i in range(20)],
}

age_ranges = {
    category: [f"{random.randint(18, 30)}-{random.randint(31, 60)}" for _ in range(20)]
    for category in scheme_names
}

genders = ["Male", "Female", "Other"]
states = ["Maharashtra", "Karnataka", "Tamil Nadu", "Kerala", "Uttar Pradesh", "Gujarat"]
marital_status = ["Married", "Unmarried", "Widowed", "Divorced"]
income_ranges_proper_format = [
    "< 2,00,000", "1,00,000 - 3,00,000", "2,00,000 - 5,00,000",
    "3,00,000 - 6,00,000", "5,00,000 - 10,00,000"
]
available_castes = ["General", "OBC", "SC", "ST", "EWS"]
ministries = [
    "Ministry of Agriculture", "Ministry of Finance", "Ministry of Education",
    "Ministry of Health", "Ministry of Housing", "Ministry of Transport",
    "Ministry of Women and Child Development", "Ministry of Sports", "Ministry of Science"
]
employment_statuses = ["Employed", "Unemployed", "Self-Employed", "Student"]

# Generate dataset
data_final_proper_income = []
for category, schemes in scheme_names.items():
    for i, scheme in enumerate(schemes):
        entry = {
            "Scheme Name": scheme,
            "Category": category,
            "Gender": genders[i % len(genders)],
            "Age Range": age_ranges[category][i % len(age_ranges[category])],
            "State": states[i % len(states)],
            "Marital Status": marital_status[i % len(marital_status)],
            "Income": income_ranges_proper_format[i % len(income_ranges_proper_format)],
            "Caste": random.sample(available_castes, k=random.randint(1, len(available_castes))),
            "Ministry": ministries[i % len(ministries)],
            "Employment Status": employment_statuses[i % len(employment_statuses)]
        }
        data_final_proper_income.append(entry)

# Save to JSON file
file_path_proper_income = "C:\\Docs\\Rujuta\\techathon\\dataset.json"
with open(file_path_proper_income, "w") as json_file:
    json.dump(data_final_proper_income, json_file, indent=4)

file_path_proper_income
