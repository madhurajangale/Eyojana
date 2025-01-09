import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import pytesseract
import re
import cv2
import numpy as np

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# ------------------------------------------------------------------------------------------------------------

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


# Configuration for file uploads
UPLOAD_FOLDER = 'uploads'  # Folder to save uploaded files
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf'}  # Allowed file types

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 6 * 1024 * 1024  # 16MB limit for uploads

# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    """Check if the file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# ------------------------------------------------------------------------------------------------------

#image preprocessing
def preprocess_image(image_path):
    """
    Preprocess the image to improve OCR accuracy.
    Args:
        image_path (str): Path to the image file.
    Returns:
        preprocessed_image (numpy.ndarray): The preprocessed image.
    """
    # Read the image
    image = cv2.imread(image_path, cv2.IMREAD_COLOR)

    # Resize the image to enhance text clarity
    target_size = 1500
    height, width = image.shape[:2]
    if max(height, width) > target_size:  # Resize only if larger than target
        scaling_factor = target_size / max(height, width)
        new_width = int(width * scaling_factor)
        new_height = int(height * scaling_factor)
        resized = cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_AREA)
    else:
        resized = image   
    # resized = cv2.resize(image, (1324, 1324), interpolation=cv2.INTER_AREA)


    # Convert to grayscale
    gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)

    # Apply Gaussian Blur to reduce noise
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)  

    # Apply thresholding
    _, thresholded = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # Denoise the image
    denoised = cv2.medianBlur(thresholded, 3)  

    # Step 5: Correct skew/rotation (deskew)
    # coords = np.column_stack(np.where(denoised > 0))
    # angle = cv2.minAreaRect(coords)[-1]
    # if angle < -45:
    #     angle = -(90 + angle)
    # else:
    #     angle = -angle
    # (h, w) = denoised.shape[:2]
    # center = (w // 2, h // 2)
    # rotation_matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
    # rotated = cv2.warpAffine(denoised, rotation_matrix, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    # print(f"[INFO] Corrected image skew with an angle of {angle:.2f} degrees.")

    # Step 6: Enhance text regions using morphological operations
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    enhanced_image = cv2.morphologyEx(denoised, cv2.MORPH_CLOSE, kernel)
    print("[INFO] Enhanced text regions using morphological operations.")

    # Debugging: Show intermediate steps (can comment these lines for production)
    # cv2.imshow("Original Image", image)
    # cv2.imshow("Grayscale", gray)
    # cv2.imshow("Binary Image", thresholded)
    # cv2.imshow("Denoised Image", denoised)
    # cv2.imshow("Rotated (Deskewed) Image", rotated)
    # cv2.imshow("Enhanced Image", enhanced_image)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()

    # Return the final preprocessed image
    return enhanced_image

# ---------------------------------------------------------------------------------------------------------

# verification functions
def verify_pan_card(text, required_text):
    """
    Verifies a PAN card by checking specific fields and patterns.
    """
    new_text = ["INCOME TAX DEPARTMENT", "GOVT. OF INDIA"] 
    required_text.extend(new_text)
    pan_pattern = r"[A-Z]{5}[0-9]{4}[A-Z]{1}"  # Example: ABCDE1234F
    # if any(field not in text for field in required_text):
    #     return False
    # if not re.findall(pan_pattern, text):
    #     return False
    text_check = any(field not in text for field in required_text)
    pan_check = bool(re.findall(pan_pattern, text))
    return text_check or pan_check

def verify_aadhaar_card(text, required_text):
    """
    Verifies an Aadhaar card by checking specific fields and patterns.
    """
    new_text = [""] 
    required_text.extend(new_text)
    aadhaar_pattern = r"[0-9]{4}\s[0-9]{4}\s[0-9]{4}"  # Example: 1234 5678 9101

    if any(field not in text for field in required_text):
        return False
    if not re.search(aadhaar_pattern, text):
        return False
    return True

def verify_driving_license(text, required_text):
    """
    Verifies a driving license by checking specific fields and patterns.
    """
    dl_pattern = r"[A-Z]{2}-?[0-9]{2}[0-9]{11}"  # Example: DL 01 12345678901
    if any(field not in text for field in required_text):
        return False
    if not re.search(dl_pattern, text):
        return False
    return True

def verify_light_bill(text, required_text):
    """
    Verifies a light bill by checking specific fields and patterns.
    """
    # Example check for customer ID and bill number
    if any(field not in text for field in required_text):
        return False
    if "Bill No" not in text or "Customer ID" not in text:
        return False
    return True

def verify_vehicle_registration(text, required_text):
    """
    Verifies a vehicle registration certificate by checking specific fields and patterns.
    """
    registration_pattern = r"[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}"  # Example: DL01 AB 1234
    if any(field not in text for field in required_text):
        return False
    if not re.search(registration_pattern, text):
        return False
    return True

def verify_bank_passbook(text, required_text):
    """
    Verifies a bank passbook by checking specific fields and patterns.
    """
    if any(field not in text for field in required_text):
        return False
    if "Account Number" not in text or "Branch" not in text:
        return False
    return True

def verify_medical_certificate(text, required_text):
    """
    Verifies a Medical Certificate by checking specific fields and patterns.
    """
    if any(field not in text for field in required_text):
        return False
    if "Medical Certificate" not in text or "Doctor's Signature" not in text:
        return False
    return True

def verify_income_certificate(text, required_text):
    """
    Verifies an Income Certificate by checking specific fields and patterns.
    """
    if any(field not in text for field in required_text):
        return False
    if "Annual Income" not in text or "Issued by" not in text:
        return False
    return True

def verify_land_ownership_certificate(text, required_text):
    """
    Verifies a Land Ownership Certificate by checking specific fields and patterns.
    """
    if any(field not in text for field in required_text):
        return False
    if "Plot Number" not in text or "Survey Number" not in text:
        return False
    return True

def verify_school_college_id(text, required_text):
    """
    Verifies a School/College ID by checking specific fields and patterns.
    """
    if any(field not in text for field in required_text):
        return False
    if "Student Name" not in text or "Roll Number" not in text or "Institution Name" not in text:
        return False
    return True

def verify_disability_certificate(text, required_text):
    """
    Verifies a Disability Certificate by checking specific fields and patterns.
    """
    if any(field not in text for field in required_text):
        return False
    if "Disability Percentage" not in text or "Issued by Medical Authority" not in text:
        return False
    return True

def verify_cast_certificate(text, required_text):
    """
    Verifies a Caste Certificate by checking specific fields and patterns.
    """
    if any(field not in text for field in required_text):
        return False
    if "Caste" not in text or "Community" not in text:
        return False
    return True

def verify_ration_card(text, required_text):
    """
    Verifies a Ration Card by checking specific fields and patterns.
    """
    if any(field not in text for field in required_text):
        return False
    if "Ration Card Number" not in text or "Household Members" not in text:
        return False
    return True

def verify_insurance_certificate(text, required_text):
    """
    Verifies an Insurance Certificate by checking specific fields and patterns.
    """
    policy_number_pattern = r"\bPolicy No\.\s?[A-Za-z0-9\-]+\b"
    if any(field not in text for field in required_text):
        return False
    if not re.search(policy_number_pattern, text):
        return False
    if "Insurance Provider" not in text or "Validity Period" not in text:
        return False
    return True

def verify_bank_statement(text, required_text):
    """
    Verifies a Bank Statement by checking specific fields and patterns.
    """
    if any(field not in text for field in required_text):
        return False
    if "Account Number" not in text or "Transaction Details" not in text:
        return False
    return True

def verify_voter_id(text, required_text):
    """
    Verifies a Voter ID by checking specific fields and patterns.
    """
    new_text = ["ELECTION COMMISSION OF INDIA"]
    required_text.extend(new_text)
    voter_id_pattern = r"[A-Z]{3}[0-9]{7}"  # Example: ABC1234567
    # if any(field not in text for field in required_text):
    #     return False
    # if not re.search(voter_id_pattern, text):
    #     return False
    # return True
    text_check = any(field not in text for field in required_text)
    pan_check = bool(re.findall(voter_id_pattern, text))
    return text_check or pan_check

def verify_gst_certificate(text, required_text):
    """
    Verifies a GST Certificate by checking specific fields and patterns.
    """
    gstin_pattern = r'^([0-2][0-9]|3[0-5])[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'  # Example GSTIN format
    if any(field not in text for field in required_text):
        return False
    if not re.search(gstin_pattern, text):
        return False
    if "GST Certificate" not in text or "Business Name" not in text:
        return False
    return True

def verify_birth_certificate(text, required_text):
    """
    Verifies a Birth Certificate by checking specific fields and patterns.
    """
    if any(field not in text for field in required_text):
        return False
    if "Date of Birth" not in text or "Place of Birth" not in text or "Registrar" not in text:
        return False
    return True

def verify_marriage_certificate(text, required_text):
    """
    Verifies a Marriage Certificate by checking specific fields and patterns.
    """
    if any(field not in text for field in required_text):
        return False
    if "Bride Name" not in text or "Groom Name" not in text or "Marriage Date" not in text:
        return False
    return True

def verify_passport(text, required_text):
    """
    Verifies a Passport by checking specific fields and patterns.
    """
    passport_pattern = r"[A-Z]{1}[0-9]{7}"  # Example: A1234567
    if any(field not in text for field in required_text):
        return False
    if not re.search(passport_pattern, text):
        return False
    if "Passport Number" not in text or "Nationality" not in text:
        return False
    return True       


# -----------------------------------------------------------------------------------------------------------------


def verify_document(image_path, doc_type, required_text):  #doc_type is taking doc_name
    """
    Function to verify a document by extracting text and checking for unique document features.
    
    Args:
    - image_path (str): Path to the document image.
    - required_text (list): List of fields to verify.
    - doc_type (str): Type of document ("PAN", "Aadhaar", "Light Bill", "Driving License").
    
    Returns:
    - bool: True if the document is verified, False otherwise.
    """

    

    # Preprocess the image
    preprocessed_image = preprocess_image(image_path)
    
    # Perform OCR using Tesseract
    custom_config = r'--psm 6'  # OCR Engine Mode and Page Segmentation Mode

    # Extract text using pytesseract
    _text = pytesseract.image_to_string(preprocessed_image, config=custom_config)
    # cleaning the text 
    extracted_text = re.sub(r"[^A-Za-z0-9\s]", "", _text)
    # print(extracted_text)
    required_text = [""]

    # Check for required text fields
    # for text in required_text:
    #     if text not in extracted_text:
    #         return False  # Text field not found, verification failed
        
    
    # Perform specific checks based on document type
    if doc_type == "PAN":
        return verify_pan_card(extracted_text, required_text)
    elif doc_type == "Aadhaar":
        return verify_aadhaar_card(extracted_text, required_text)
    elif doc_type == "Driving License":
        return verify_driving_license(extracted_text, required_text)
    elif doc_type == "Light Bill":
        return verify_light_bill(extracted_text, required_text)
    elif doc_type == "Vehicle Registration Certificate":
        return verify_vehicle_registration(extracted_text, required_text)
    elif doc_type == "Bank Passbook":
        return verify_bank_passbook(extracted_text, required_text)
    elif doc_type == "Medical Certificate":
        return verify_medical_certificate(extracted_text, required_text)
    elif doc_type == "Income Certificate":
        return verify_income_certificate(extracted_text, required_text)
    elif doc_type == "Land Ownership Certificate":
        return verify_land_ownership_certificate(extracted_text, required_text)
    elif doc_type == "School/College ID":
        return verify_school_college_id(extracted_text, required_text)
    elif doc_type == "Disability Certificate":
        return verify_disability_certificate(extracted_text, required_text)
    elif doc_type == "Caste Certificate":
        return verify_cast_certificate(extracted_text, required_text)
    elif doc_type == "Ration Card":
        return verify_ration_card(extracted_text, required_text)
    elif doc_type == "Insurance Certificate":
        return verify_insurance_certificate(extracted_text, required_text)
    elif doc_type == "Bank Statement":
        return verify_bank_statement(extracted_text, required_text)
    elif doc_type == "Voter ID":
        return verify_voter_id(extracted_text, required_text)
    elif doc_type == "GST Certificate":
        return verify_gst_certificate(extracted_text, required_text)
    elif doc_type == "Birth Certificate":
        return verify_birth_certificate(extracted_text, required_text)
    elif doc_type == "Marriage Certificate":
        return verify_marriage_certificate(extracted_text, required_text)
    elif doc_type == "Passport":
        return verify_passport(extracted_text, required_text)    
    # Add more document-specific checks here
    else:
        print(f"Error: Unsupported document type '{doc_type}'.")
        return False
    
# -----------------------------------------------------------------------------------------------------------

@app.route('/upload-documents', methods=['POST'])
def upload_documents():
    """
    Handle multiple document uploads and verification.
    Expected input:
    - Files: Each document file
    - Metadata: Document names and types in JSON
    """

    # Check if the request contains a file
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']

    # Validate that the required metadata is present
    doc_name = request.form.get('docName')
    required_text = request.form.get('required_text', '')
    # doc_type = request.form.get('docType')


    if not doc_name:
        return jsonify({"error": "docName is required"}), 400

    # Check if the uploaded file is allowed
    if file and allowed_file(file.filename):
        # Secure the filename
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        # Save the file to the upload folder
        file.save(file_path)

        # Verify the document
        try:
            is_verified = verify_document(file_path, doc_name, required_text)
            return jsonify({
                "name": doc_name,
                # "type": doc_type,
                "success": is_verified,
                "file_path": file_path 
            }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Invalid or unsupported file type"}), 400


# ------------------------------------------------------------------------------------------------------------

# Example usage
if __name__ == "__main__":
    app.run(debug=True, port=5500)

 # aadhaar, pan, driving license, 