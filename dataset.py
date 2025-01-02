import json
import random

# Define scheme categories and related attributes
scheme_names = {
    "Agriculture": [f"Agriculture, Rural & Environment {i+1}" for i in range(20)],
    "Banking": [f"Banking, Financial Services and Insurance {i+1}" for i in range(20)],
    "Business Entrepreneurship": [f"Business & Entrepreneurship {i+1}" for i in range(20)],
    "Education": [f"Education & Learning {i+1}" for i in range(20)],
    "Health": [f"Health & Wellness {i+1}" for i in range(20)],
    "Housing": [f"Housing & Shelter {i+1}" for i in range(20)],
    "Public Safety": [f"Public Safety, Law & Justice {i+1}" for i in range(20)],
    "Science": [f"Science, IT & Communications {i+1}" for i in range(20)],
    "Skills": [f"Skills & Employment {i+1}" for i in range(20)],
    "Social Welfare": [f"Social Welfare & Empowerment {i+1}" for i in range(20)],
    "Sports": [f"Sports & Culture {i+1}" for i in range(20)],
    "Transport": [f"Transport & Infrastructure {i+1}" for i in range(20)],
    "Travel": [f"Travel & Tourism {i+1}" for i in range(20)],
    "Utility and Sanitation": [f"Utility & Sanitation {i+1}" for i in range(20)],
    "Women and Child": [f"Women and Child {i+1}" for i in range(20)],
}

# Ministries for each category
ministries_by_category = {
    "Agriculture": "Ministry of Agriculture",
    "Banking": "Ministry of Finance",
    "Business Entrepreneurship": "Ministry of Finance",
    "Education": "Ministry of Education",
    "Health": "Ministry of Health",
    "Housing": "Ministry of Housing",
    "Public Safety": "Ministry of Home Affairs",
    "Science": "Ministry of Science",
    "Skills": "Ministry of Skill Development",
    "Social Welfare": "Ministry of Social Justice and Empowerment",
    "Sports": "Ministry of Sports",
    "Transport": "Ministry of Transport",
    "Travel": "Ministry of Tourism",
    "Utility and Sanitation": "Ministry of Urban Development",
    "Women and Child": "Ministry of Women and Child Development"
}

# Other fixed attributes
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

# Documents specific to each category
documents_by_category = {
    "Agriculture": [
        "Aadhar Card", "Land Ownership Certificate", "Income Certificate",
        "Agricultural Credit Card", "Bank Passbook", "Soil Health Card"
    ],
    "Banking": [
        "Aadhar Card", "PAN Card", "Bank Statement", "Income Certificate", "Voter ID"
    ],
    "Business Entrepreneurship": [
        "Aadhar Card", "Business Registration Certificate", "Income Certificate",
        "GST Certificate", "Bank Passbook", "PAN Card"
    ],
    "Education": [
        "Aadhar Card", "Birth Certificate", "School/College ID", "Income Certificate",
        "Caste Certificate", "Admission Receipt"
    ],
    "Health": [
        "Aadhar Card", "Health Insurance Card", "Doctor's Prescription",
        "Birth Certificate", "Medical Certificate", "Income Certificate"
    ],
    "Housing": [
        "Aadhar Card", "Land Ownership Certificate", "Income Certificate",
        "Bank Passbook", "Ration Card", "Electricity Bill"
    ],
    "Public Safety": [
        "Aadhar Card", "Voter ID", "Police Clearance Certificate", "Income Certificate",
        "Birth Certificate", "PAN Card"
    ],
    "Science": [
        "Aadhar Card", "Academic Certificates", "Research Proposal",
        "Caste Certificate", "Income Certificate"
    ],
    "Skills": [
        "Aadhar Card", "Training Completion Certificate", "Bank Passbook",
        "Income Certificate", "Birth Certificate"
    ],
    "Social Welfare": [
        "Aadhar Card", "Income Certificate", "Caste Certificate", "Bank Passbook",
        "Ration Card", "Disability Certificate (if applicable)"
    ],
    "Sports": [
        "Aadhar Card", "Sports Achievement Certificates", "Income Certificate",
        "Birth Certificate", "School ID (if student)", "Bank Passbook"
    ],
    "Transport": [
        "Aadhar Card", "Driving License", "Vehicle Registration Certificate",
        "Income Certificate", "PAN Card", "Insurance Certificate"
    ],
    "Travel": [
        "Aadhar Card", "Passport", "Bank Passbook", "Income Certificate",
        "Travel Itinerary", "Voter ID"
    ],
    "Utility and Sanitation": [
        "Aadhar Card", "Income Certificate", "Electricity Bill", "Water Bill",
        "Ration Card", "Caste Certificate"
    ],
    "Women and Child": [
        "Aadhar Card", "Birth Certificate", "Marriage Certificate (if applicable)",
        "Income Certificate", "Caste Certificate", "Ration Card"
    ],
}

# Generate the dataset with the new structure
data = []
all_documents = set(doc for docs in documents_by_category.values() for doc in docs)
for category, schemes in scheme_names.items():
    for i, scheme in enumerate(schemes):
        gender = genders[i % len(genders)]
        employment_status = random.choice(["Employed", "Unemployed", "Self-Employed", "Student"])
        marital_status = random.choice(marital_status)
        
        if marital_status == "Widowed":
            gender = "Female"
        if marital_status == "Divorced" and gender == "Male":
            marital_status = random.choice(["Unmarried", "Married"])
        
        # Assign documents specific to category
        random_documents = random.sample(
            list(all_documents - set(documents_by_category[category])),
            k=random.randint(2, 4)
        )
        

        # Create an entry with the required data
        entry = {
            "Scheme Name": scheme,
            "Category": category,
            "Gender": gender,
            "Age Range": age_ranges[category][i % len(age_ranges[category])],
            "State": states[i % len(states)],
            "Marital Status": marital_status,
            "Income": random.choice(income_ranges_proper_format),
            "Caste": random.sample(available_castes, k=random.randint(1, len(available_castes))),
            "Ministry": ministries_by_category[category],  # Assign the correct ministry based on category
            "Ministry": ministries_by_category[category],  # Assign the correct ministry based on category
            "Employment Status": employment_status,
            "Documents": list(set(documents_by_category[category]).union(random_documents)),
            "Documents": list(set(documents_by_category[category]).union(random_documents)),
        }
        data.append(entry)

# Save the dataset to JSON
output_file = "C:\\Docs\\Rujuta\\techathon\\Eyojana\\dataset_updated.json"
with open(output_file, "w") as json_file:
    json.dump(data, json_file, indent=4)

print(f"Dataset has been saved to {output_file}")
